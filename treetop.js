var Treetop = {};
Treetop.Parser = {};
Treetop.Parser.create = function()
{

    var tt = {};
    tt.rules = [];
    tt.consumeAllInput = true;

    tt.parse = function(code, environment)
    {
        if (tt.rules.length == 0)
        {
            throw("Please define a grammar by extending the parser");
        }

        var topLevelFunction = tt.rules[0];
        return topLevelFunction(code, environment);
    }

    return tt;

}
