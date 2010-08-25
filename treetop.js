var Treetop = {};
Treetop.Parser = {};
Treetop.Parser.create = function()
{

    var tt = {};
    tt.rules = [];
    tt.consumeAllInput = true;

    tt.parse = function(code)
    {
        if (tt.rules.length == 0)
        {
            throw("Please define a grammar by extending the parser");
        }

        var topLevelFunction = tt.rules[0];
        return topLevelFunction(code);
    }

    /**
     * Given "number" and rules [operand]
     * We should get back the following parse tree:
     * [
     *  [
     *      { rule: operand,    code: 'number' }
     *  ]
     * ]
     *
     * Given "number" and rules [operand, space, operand]
     * We should get back an empty parse tree []
     *
     * Given "number variable" and rules [operand, space, operand]
     * We should get back a parse tree with only one option:
     * [
     *  [
     *      { rule: operand,    code: 'number' },
     *      { rule: space,      code: ' ' },
     *      { rule: operand,    code: 'variable' }
     *  ]
     * ]
     */
    tt.findToken = function(rule, code)
    {
        var findToken = {
            rule: rule,
            code: code,
            matches: []
        };

        if (findToken.code.length == 0)
        {
            return;
        }


        // See if this code matches the rule
        if (findToken.rule(findToken.code))
        {
            findToken.matches.push(findToken.code);
        }

        // Recurse with code 1 character shorter
        findToken.shorterCode = findToken.code.substring(0, findToken.code.length - 1);
        findToken.matches.concat( tt.findToken(findToken.rule, findToken.shorterCode) );

        return findToken.matches;
    }

    return tt;

}

Treetop.BootstrapGrammar = {};
Treetop.BootstrapGrammar.create = function()
{

    var bg = Treetop.Parser.create();
    bg.rules = [
        bg.phrase = function(code)
        {
            return bg.findToken(bg.operand, code) && bg.findToken(bg.space, code) && bg.findToken(bg.operand, code);
        },

        bg.operand = function(code)
        {
            if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(code))
            {
                return false;
            }

            return bg.operand;
        },

        bg.space = function(code)
        {
            if (/^[\ ]+$/.test(code))
            {
                return bg.space;
            }

            return false;
        }
    ];

    return bg;

}