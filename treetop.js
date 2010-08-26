var Treetop = {};
Treetop.Parser = {};
Treetop.Parser.create = function()
{

    var tt = {};
    tt.rules = [];
    tt.consumeAllInput = true;

    /**
     * Given code: "" and rules [] return false
     *
     * Given "number" and rules [operand]
     * We should get back the following parse tree:
     * [
     *  [
     *      { rule: operand,    code: 'number' }
     *  ]
     * ]
     *
     * Given "number" and rules [operand, space, operand]
     * Return false
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
    tt.parse = function(code, rules)
    {
        var parse = {
            code: code,
            rules: rules,
            matches: []
        };

        if (parse.rules.length == 0)
        {
            return [];
        }

        if (parse.rules.length == 1)
        {
            // Return the results of the applied rule
            parse.ruleToMatch = parse.rules.shift();
            if (parse.ruleToMatch(parse.code))
            {
                // Success!
                return [{ code: parse.code, rule: parse.ruleToMatch }];
            }

            // The code did not match the rule
            return [];
        }

        parse.ruleToMatch = parse.rules[0];
        // Find all matches for the first rule
        for (var i = 0; i <= code.length; i++)
        {
            parse.codeSubject = code.substring(0, i);
            parse.codeRest = code.substring(i);

            // Continue if the code subject didn't match our current rule
            // Returns an array of objects
            parse.subjectParseResults = tt.parse(parse.codeSubject, [parse.ruleToMatch]);
            if (parse.subjectParseResults.length <= 0)
            {
                continue;
            }

            // Continue if the rest of the code couldn't be parsed
            // Returns an array (options) of arrays (steps) of objects (tokens)
            // Option A
            //  - step 1
            //    - token a
            //    - token b
            //  - step 2
            //    - token a
            //    - token b
            // Option B
            //  - step 1
            //    - token a
            //    - token b
            //  - step 2
            //    - token a
            //    - token b
            parse.restParseResults = tt.parse(parse.codeRest, parse.rules.slice(1));
            if (parse.restParseResults.length <= 0)
            {
                continue;
            }

            // Success; both the current code subject and the rest were parsed
            for (var j in parse.restParseResults)
            {
                parse.matches.push(
                    parse.subjectParseResults.concat(parse.restParseResults[j])
                );
            }
        }

        return parse.matches;
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

        bg.parenthesized = function(code)
        {
            if (!/^\([^\)]+\)$/.test(code))
            {
                return false;
            }

            return bg.parenthesized;
        },

        bg.orSign = function(code)
        {
            if (!/^\/$/.test(code))
            {
                return false;
            }

            return bg.orSign;
        },

        bg.space = function(code)
        {
            if (/^[\ ]*$/.test(code))
            {
                return bg.space;
            }

            return false;
        }
    ];

    return bg;

}