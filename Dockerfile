FROM node:20-alpine 

WORKDIR /usr/src/app

# COPY  --chown=node:node . .
COPY . .


RUN npm install && npm cache clean --force
# USER node
RUN npm run build
# RUN cd /packages/dev-server 


EXPOSE 3000

CMD ["npm", "run", "start"]
# # base node image
# FROM node:20.10.0-bullseye-slim as base

# # Install openssl for Prisma
# RUN apt-get update && apt-get install -y openssl

# # Install all node_modules, including dev dependencies
# FROM base as deps

# RUN mkdir /app
# WORKDIR /app

# ADD package.json package-lock.json ./
# RUN npm install --legacy-peer-deps 

# # Setup production node_modules
# FROM base as production-deps

# ENV NODE_ENV production

# RUN mkdir /app
# WORKDIR /app

# COPY --from=deps /app/node_modules /app/node_modules
# ADD package.json package-lock.json ./
# RUN npm prune --production

# # Build the app
# FROM base as build

# RUN mkdir /app
# WORKDIR /app

# COPY --from=deps /app/node_modules /app/node_modules

# ADD . .
# RUN npm run build

# # Finally, build the production image with minimal footprint
# FROM base

# ENV NODE_ENV production

# RUN mkdir /app
# WORKDIR /app

# COPY --from=production-deps /app/node_modules /app/node_modules
# COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
# COPY --from=build /app/build /app/build
# COPY --from=build /app/public /app/public
# ADD . .

# CMD ["npm", "run", "start"]