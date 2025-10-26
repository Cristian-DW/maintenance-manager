const cds = require('@sap/cds');
const request = require('supertest');

describe('Maintenance Service', () => {
    let app;

    beforeAll(async () => {
        await cds.deploy(__dirname + '/../srv/service.cds').to('sqlite::memory:');
        await require('../db/data/seed').seed();
        app = require('express')();
        await cds.serve('MaintenanceService').in(app);
    });

    it('should list maintenance requests', async () => {
        const response = await request(app)
            .get('/maintenance/MaintenanceRequests')
            .expect(200);

        expect(response.body.value).toBeDefined();
        expect(Array.isArray(response.body.value)).toBeTruthy();
    });

    it('should create a maintenance request', async () => {
        const newRequest = {
            title: 'Test Request',
            description: 'Test Description',
            priority: 2,
            requestedBy_ID: '3',
            asset_ID: '1'
        };

        const response = await request(app)
            .post('/maintenance/MaintenanceRequests')
            .send(newRequest)
            .expect(201);

        expect(response.body.title).toBe(newRequest.title);
        expect(response.body.status).toBe('OPEN');
    });

    it('should validate priority range', async () => {
        const invalidRequest = {
            title: 'Invalid Priority',
            description: 'Test',
            priority: 5,
            requestedBy_ID: '3',
            asset_ID: '1'
        };

        await request(app)
            .post('/maintenance/MaintenanceRequests')
            .send(invalidRequest)
            .expect(400);
    });
});