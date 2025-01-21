import React, { useState, useEffect } from 'react';
import { processRules } from './parseRules';

const TreeNode = ({ label, value, children, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children && children.length > 0;

  return (
    <div className="relative ml-8">
      {/* Connector lines */}
      <div className="absolute w-8 h-0.5 bg-gray-300 -left-8 top-4"></div>
      {!isLast && hasChildren && (
        <div className="absolute w-0.5 bg-gray-300 -left-8 top-4 h-full"></div>
      )}

      {/* Node content */}
      <div className="relative">
        <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 px-4 py-2 shadow-sm">
          {hasChildren && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
          <span className="font-medium mr-2">{label}:</span>
          <span className="text-gray-600">
            {Array.isArray(value) ? value.join(', ') : 
             value === true ? 'Yes' :
             value === false ? 'No' :
             value}
          </span>
        </div>

        {/* Error message if this is a leaf node */}
        {!hasChildren && value?.errorMessage && (
          <div className="mt-2 ml-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {value.errorMessage}
          </div>
        )}

        {/* Children nodes */}
        {isExpanded && hasChildren && (
          <div className="mt-4">
            {children.map((child, index) => (
              <TreeNode 
                key={`${child.label}-${index}`}
                {...child}
                isLast={index === children.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const RuleTree = () => {
  const [ruleTrees, setRuleTrees] = useState(new Map());
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const response = await fetch('/rules.txt');
        const text = await response.text();
        const groupedRules = await processRules(text);
        setRuleTrees(groupedRules);
      } catch (error) {
        console.error('Error loading rules:', error);
        setError('Failed to load rules. Please ensure rules.txt is in the public directory.');
      }
    };

    loadRules();
  }, []);

  const buildTreeStructure = (rules) => {
    const hierarchy = ['TxnPurpose', 'TxnInitiationMode', 'TxnSubType', 'Verified', 'Genre'];
    
    const buildBranches = (rules, level = 0) => {
      if (level >= hierarchy.length) return [];

      const currentField = hierarchy[level];
      const branches = new Map();

      rules.forEach(rule => {
        const value = rule.conditions[currentField];
        const key = value ? 
                   (Array.isArray(value) ? value.join(',') : value.toString()) : 
                   'null';

        if (!branches.has(key)) {
          branches.set(key, []);
        }
        branches.get(key).push(rule);
      });

      return Array.from(branches.entries()).map(([value, groupedRules]) => ({
        label: hierarchy[level],
        value: value === 'null' ? null : value,
        children: buildBranches(groupedRules, level + 1)
      }));
    };

    return buildBranches(rules);
  };

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center">Rule Engine Visualization</h1>
      <div className="space-y-12 max-w-6xl mx-auto">
        {Array.from(ruleTrees.entries()).map(([mcc, rules], index) => (
          <div key={mcc} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b">
              {mcc === 'NO_MCC' ? 'Rules without MCC' : `Rules for MCC: ${mcc}`}
            </h2>
            <div className="relative">
              {buildTreeStructure(rules).map((node, idx) => (
                <TreeNode 
                  key={`${mcc}-${idx}`}
                  {...node}
                  isLast={idx === rules.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleTree;