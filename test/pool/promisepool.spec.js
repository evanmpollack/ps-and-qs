import PromisePool from '../../lib/pool/promisepool.js';

const task = () => new Promise((resolve) => setTimeout(resolve, 500));

describe.only('PromisePool', function() {
    describe('init', function() {
        it('should throw an error if promise suppliers array is empty');
        it('should throw an error if promise suppliers array is nullish');
        it('should throw an error if limit <= 0');
    });
    
    describe('#start', function() {
        context('pool promise', function() {
            context('resolved', function() {
                it('should resolve with the results of each task given tasks that resolve');
                it('should resolve with the results of each task given tasks that reject');
                it('should resolve with the results of each task given tasks that error');
            });

            context.skip('rejected', function() {
                // Not possible at the moment?
            });
        });

        context('task promise', function() {
            context('resolved', function() {
                it('result should have a \'status\' property equal to \'fulfilled\'');
                it('result should have a \'value\' property equal to the resolved value');
            });

            context('rejected', function() {
                it('results should have a \'status\' property equal to \'rejected\'');
                
                context('rejected by reject function', function() {
                    it('result should have a \'reason\' property equal to the rejected value');
                });

                context('rejected by unhandled error', function() {
                    it('result should have a \'reason\' property equal to the error message');
                });
            });
        });
    });
});