#!/bin/bash
# render-build.sh
pnpm install
pnpm prisma generate
pnpm run build