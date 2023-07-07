FROM python:3.11-slim
WORKDIR /code/src
ENTRYPOINT ["/code/src/init.sh"]
CMD ["run"]



ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/code/src

COPY calculate_signal.py calculate_signal.py
COPY init.sh init.sh
USER 1000

