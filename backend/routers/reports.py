from fastapi import APIRouter

router = APIRouter()

@router.get("/reports/") 
async def read_reports():
    return [{"report_id": 1, "report_name": "Report 1"}, {"report_id": 2, "report_name": "Report 2"}]