# frontend-service.dockerfile
FROM golang:1.22.2 AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o main cmd/*.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/main /root/main
COPY ./views /root/views

EXPOSE 8080

CMD ["/root/main"]

LABEL version="v3.0"
LABEL frontend_engineer="adiozdaniel@gmail.com"
LABEL backend_engineer="datieno001@gmail.com"
