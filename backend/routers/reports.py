from fastapi import APIRouter, Depends
from service import ReportsService
from dependencies import get_reports_service
from models import Report
from typing import List

router = APIRouter()


@router.get("/reports/", response_model=List[Report])
async def read_all_reports(
    service: ReportsService = Depends(get_reports_service),
):
    reports = service.read_reports()
    return reports
