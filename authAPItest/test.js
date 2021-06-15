
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../auth';
let expect = chai.expect;

chai.use(require('chai-like'));
chai.use(require('chai-things'));
// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Users", () => {
    describe("GET /", () => {
        
        it("should get all users", () => {
            chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                const arr = res.body;
                expect(res.body).to.be.an('array');
                expect(arr[0]).to.be.a('object');
            });
        });
        
        it("should get a single user", () => {
            const id = 'mm@com';
            chai.request(app)
            .get(`/${id}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('string');
                res.body.should.include('@');
                
            });
        });
        
        
        it("should not get a single user record", () => {
            const id = 'kk@com';
            chai.request(app)
            .get(`/Users/get/${id}`)
            .end((err, res) => {
                res.should.have.status(404);
            });
        });
    });
});
