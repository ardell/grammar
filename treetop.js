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

Treetop.BootstrapGrammar = {};
Treetop.BootstrapGrammar.create = function()
{

    var bg = Treetop.Parser.create();
    bg.rules = [
        bg.operand = function(code)
        {
            if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(code))
            {
                return false;
            }

            return bg.operand;
        },
    ];

    return bg;

}