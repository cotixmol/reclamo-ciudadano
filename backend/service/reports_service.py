class ReportsService:
    def __init__(self, repository):
        self.repository = repository

    def read_reports(self):
        return self.repository.read_reports()
