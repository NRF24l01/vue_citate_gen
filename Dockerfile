FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=ghcr.io/nrf24l01/vue_citate_gen/vue-builder /app/dist /usr/share/nginx/html
