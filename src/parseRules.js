const parseRule = (ruleString) => {
    try {
        const cleanString = ruleString.replace(/\\\"/g, '"');
        const ruleJson = JSON.parse(cleanString);
        return {
            conditions: ruleJson.Condition,
            validations: ruleJson.Validations,
            errorMessage: ruleJson.ErrorMessageFormat,
            raw: ruleJson // Keep the raw data for reference
        };
    } catch (error) {
        console.error('Error parsing rule:', error);
        return null;
    }
};

// Group rules by their starting conditions (MCC)
const groupRulesByMcc = (rules) => {
    const mccGroups = new Map();
    
    rules.forEach(rule => {
        const mccs = rule.conditions.Mcc;
        if (!mccs || mccs.length === 0) {
            // For rules without MCC, use 'NO_MCC' as key
            const noMccGroup = mccGroups.get('NO_MCC') || [];
            noMccGroup.push(rule);
            mccGroups.set('NO_MCC', noMccGroup);
        } else {
            // A rule can belong to multiple MCC groups
            mccs.forEach(mcc => {
                const group = mccGroups.get(mcc) || [];
                group.push(rule);
                mccGroups.set(mcc, group);
            });
        }
    });

    return mccGroups;
};

export const processRules = async (fileContent) => {
    const rules = fileContent.split('\n')
        .filter(line => line.trim())
        .map(parseRule)
        .filter(rule => rule !== null);
    
    return groupRulesByMcc(rules);
};