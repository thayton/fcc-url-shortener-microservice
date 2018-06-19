const expect = require('expect');
const request = require('supertest');

const { app } = require('./../index');
const { Url } = require('./../models/url');

// Ensure our test database is empty
before((done) => {
    console.log('Cleaning existing test database...');
    Url.remove({}).then(() => done());
});

describe('POST /api/shorturl/new', () => {
    it('should create a new url with shortened value of 1', (done) => {
        var url = 'http://www.apple.com';
        
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

    it('should use the existing url with shortened value of 1', (done) => {
        var url = 'http://www.apple.com';
        
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

    it('should return an error indicating an invalid url', (done) => {
        var url = 'http://x.y.z.';
        
        request(app)
            .post('/api/shorturl/new')
            .send('url='+url)
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe('invalid URL');
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

    it('should redirect us to www.apple.com', (done) => {
        request(app)
            .get('/api/shorturl/1')
            .expect(302)
            .expect('Location', 'http://www.apple.com')
            .end(done);
    });
});
                
