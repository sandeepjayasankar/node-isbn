var sys = require('sys'),
    OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAIZ3E7SQNZARUSUSQ',
    awsSecret: '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',
    assocId:   'priceseer-20',
});

opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': 'nagas',
    'ResponseGroup': 'ItemAttributes'
}, function(error, results) {
    if (error) { sys.print('Error: ' + error + "\n") }
    sys.print("Results:\n" + sys.inspect(results.Items.Item[0].DetailPageURL) + "\n");
});