# app/routers/events.py
from fastapi import APIRouter, Depends, HTTPException, Query
from bson import ObjectId
from app.db import db
from app.deps import get_current_user
from app.models.event import EventCreateBody, EventUpdateBody
import time

router = APIRouter(prefix="/events", tags=["events"])


def to_event_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_id": doc.get("user_id", ""),
        "dateISO": doc.get("dateISO", ""),
        "title": doc.get("title", ""),
        "note": doc.get("note", ""),
        "done": bool(doc.get("done", False)),
        "createdAt": int(doc.get("createdAt", 0)),
    }


def block_guest_write(user: dict):
    if user.get("isGuest"):
        raise HTTPException(
            status_code=403,
            detail="Guest does not persist data. Use localStorage on frontend."
        )


@router.get("")
@router.get("/")
async def list_events(
    dateISO: str = Query(default=""),
    user=Depends(get_current_user),
):
    # 訪客：前端理論上不該打後端 events，這裡保守回空
    if user.get("isGuest"):
        return []

    q = {"user_id": user["user_id"]}
    if dateISO:
        q["dateISO"] = dateISO

    cursor = db.events.find(q).sort("createdAt", 1)

    out = []
    async for doc in cursor:
        out.append(to_event_out(doc))
    return out


@router.post("")
@router.post("/")
async def create_event(
    body: EventCreateBody,
    user=Depends(get_current_user),
):
    block_guest_write(user)

    doc = {
        "user_id": user["user_id"],
        "dateISO": body.dateISO,
        "title": body.title,
        "note": body.note,
        "done": False,
        "createdAt": int(time.time() * 1000),
    }

    result = await db.events.insert_one(doc)
    saved = await db.events.find_one({"_id": result.inserted_id, "user_id": user["user_id"]})
    if not saved:
        raise HTTPException(status_code=500, detail="Insert failed")

    return to_event_out(saved)


@router.patch("/{event_id}")
async def update_event(
    event_id: str,
    body: EventUpdateBody,
    user=Depends(get_current_user),
):
    block_guest_write(user)

    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event id")

    update_doc = {}

    # 只有傳了才更新（EventUpdateBody 裡要用 Optional）
    if body.dateISO is not None:
        update_doc["dateISO"] = body.dateISO
    if body.title is not None:
        update_doc["title"] = body.title
    if body.note is not None:
        update_doc["note"] = body.note
    if body.done is not None:
        update_doc["done"] = body.done

    if not update_doc:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = await db.events.update_one(
        {"_id": oid, "user_id": user["user_id"]},
        {"$set": update_doc},
    )

    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    saved = await db.events.find_one({"_id": oid, "user_id": user["user_id"]})
    if not saved:
        raise HTTPException(status_code=404, detail="Event not found")

    return to_event_out(saved)


@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    user=Depends(get_current_user),
):
    block_guest_write(user)

    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event id")

    res = await db.events.delete_one({"_id": oid, "user_id": user["user_id"]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"ok": True}
