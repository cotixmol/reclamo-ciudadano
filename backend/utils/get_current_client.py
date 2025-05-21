from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session, select
from models import ApiKey, Client
from config import db_reporte_ciudadano


async def get_current_client(
    api_key: str = Header(..., alias="x-api-key"),
    session: Session = Depends(db_reporte_ciudadano.get_session),
) -> Client:
    stmt = select(ApiKey).where(ApiKey.key == api_key, ApiKey.active.is_(True))
    api_key_row = session.exec(stmt).first()

    if not api_key_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
        )

    return api_key_row.client
