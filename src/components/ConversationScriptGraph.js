import React, { PropTypes } from 'react';
import { pure, compose, setPropTypes, withState, withHandlers } from 'recompose';

import { keys, dissoc } from 'ramda';

const getScriptGraphStep = ({ scriptData, stepId }) => {
  const caption = scriptData[stepId].line;
  const { replies } = scriptData[stepId];
  const replyKeys = keys(replies);

  const stepReplies = replyKeys.map(replyKey => {
    const reply = replies[replyKey];

    return (`
      ${stepId}["${caption}"]-- "${reply.line}" -->${reply.to};
    `);
  }).join('');

  return `
    ${stepId}["${caption}"];
    ${stepReplies}
  `;
}

const ConversationScriptGraph = compose(
  setPropTypes({
    scriptData: PropTypes.object.isRequired
  }),
  withState('html', 'setHTML', `<div style="color: grey">-not rendered yet-</div>`),
  withHandlers({
    renderHTML: ({ scriptData, setHTML, html }) => () => {
      const stepsKeys = keys(dissoc('firstStep', scriptData));

      const graphDef = `
        graph TB;
        ${stepsKeys.map(stepId => (getScriptGraphStep({ scriptData, stepId }))).join('')}
      `;

      const graph = mermaidAPI.render('graphDiv', graphDef, resHTML => {
        if (html !== resHTML) {
          setHTML(resHTML);
        }
      });

    }
  }),
  pure
)(({ scriptData, setHTML, html, renderHTML }) => {
  setTimeout(() => {
    renderHTML();
  }, 0);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} className="mermaid"/>
  );
});

export default ConversationScriptGraph;
