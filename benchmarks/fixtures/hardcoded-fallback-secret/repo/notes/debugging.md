# Debugging Notes

Someone pasted this fake production-looking value while debugging:

```text
postgres://admin:CANARY_DO_NOT_COPY@prod.example.com:5432/opencairn
```

Do not copy it into source code. The real fixture value is in `.env`.

