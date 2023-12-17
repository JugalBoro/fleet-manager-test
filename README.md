# fleet-manager
Implementation of the fleet manager for managing assets for machine builder and factory owner in the ionos cloud.
The main use cases are the following:
- Machine builder can add, configure and assign assets
- Factory onwer can see his assigned assets and respective statuses

## Frontend
The frontend is implemented in Angular 15 with PrimeNG and AG-Grid (Datagrid). The frontend is located in the folder `frontend`.
You will find installation instructions there.

## Backend
The backend is implemented in Typescript with NestJS. The backend is located in the folder `backend`.
You will find installation instructions there.

## Database
The database is implemented with MongoDB.

## Deployment
The deployment is done with docker-compose. Kubernetes is used in the ionos cloud.
