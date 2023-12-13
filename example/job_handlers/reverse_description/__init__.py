import os
from datetime import datetime
from pathlib import Path
from typing import Tuple

from services.dmss import get_document
from services.job_handler_interface import Job, JobHandlerInterface, JobStatus
from utils.logging import logger

_SUPPORTED_TYPE = "dmss://WorkflowDS/Blueprints/ReverseDescription"


# TODO: Make a more realistic example with progress and a result file.
class JobHandler(JobHandlerInterface):
    """
    A silly test jobHandler that creates a NamedEntity of the input with it's description reversed
    """

    def __init__(
        self,
        job: Job,
        data_source: str,
    ):
        super().__init__(job, data_source)
        self.headers = {"Access-Key": job.token or ""}
        self.results_directory = f"{Path(__file__).parent}/results"
        os.makedirs(self.results_directory, exist_ok=True)

    def start(self) -> str:
        logger.info("Starting ReverseDescription job.")
        application_reference = self.job.application_input
        application_input_entity = get_document(application_reference["address"], token=self.job.token)
        result = application_input_entity.get("description", "Backup")[::-1]
        with open(f"{self.results_directory}/{self.job.job_uid}", "w") as result_file:
            result_file.write(result)
        logger.info("ReverseDescription job completed")
        self.job.status = JobStatus.COMPLETED
        self.job.stopped = datetime.now()
        return "OK"

    def result(self) -> Tuple[str, bytes]:
        result_file_path = Path(f"{self.results_directory}/{self.job.job_uid}")
        if not result_file_path.is_file():
            return "No result file found", b""

        with open(result_file_path, "rb") as result_file:
            return "Done", result_file.read()

    def progress(self) -> Tuple[JobStatus, None | list[str] | str, None | float]:
        return self.job.status, "Progress tracking not implemented", self.job.percentage
