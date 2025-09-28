# Only used in production
FROM caddy:2-builder AS builder

RUN xcaddy build \
    --with github.com/mholt/caddy-ratelimit

FROM caddy:2-alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Create log directory
RUN mkdir -p /var/log/caddy && chown -R caddy:caddy /var/log/caddy

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/bin/caddy /usr/bin/caddy