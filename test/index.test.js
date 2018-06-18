const expect = require('expect');
const request = require('supertest');

const { app } = require('./../index');
const { Url } = require('./../models/url');

// Ensure our test database is empty
beforeEach((done) => {
    Url.remove({}).then(() => done());
});

describe('POST /api/shorturl/new', () => {
    it('should create a new url with shortened value of 1', (done) => {
        var url = 'http://www.google.com';
        
        request(app)
            .post('/api/shorturl/new')
            .send('url='+url)
            .expect(200)
            .expect((res) => {
                expect(res.body.original).toBe(url);
                expect(res.body.shortened).toBe('1');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Url.find().then((urls) => {
                    expect(urls.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});
                
