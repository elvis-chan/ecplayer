import * as _ from 'underscore';

/* eslint-disable import/prefer-default-export */

const classNameArray = element => (
  typeof element.className === 'string' ?
    element.className.split(' ') : []
);

const setClassName = (element, className) => {
  if (element.className !== className) {
    // eslint-disable-next-line no-param-reassign
    element.className = className;
  }
};

export const hasClass = (element, className) => element.className && new RegExp(`(^|\\s)${className}(\\s|$)`).test(element.className);


export const createElement = (content, id = '') => {
  const newElement = document.createElement('div');

  newElement.innerHTML = content;

  if (!_.isEmpty(id)) {
    newElement.firstChild.setAttribute('id', id);
  }

  return newElement.firstChild;
};

export const replaceWith = (element, options) => {
  const { content, id } = options;
  const newElement = createElement(content, id);

  element.parentNode.replaceChild(newElement, element);

  return document.getElementById(id);
};

export const classList = (element) => {
  if (element.classList) {
    return element.classList;
  }

  return classNameArray(element);
};

export const addClass = (element, classes) => {
  const originalClasses = classNameArray(element);
  const addClasses = _.isArray(classes) ? classes : classes.split(' ');
  _.each(addClasses, (newClass) => {
    if (!_.contains(originalClasses, newClass)) {
      originalClasses.push(newClass);
    }
  });
  setClassName(element, originalClasses.join(' '));
};

export const removeClass = (element, classes) => {
  const originalClasses = classNameArray(element);
  const removeClasses = _.isArray(classes) ? classes : classes.split(' ');

  setClassName(element, _.difference(originalClasses, removeClasses).join(' '));
};

export const toggleClass = (element, className) => {
  if (hasClass(element, className)) {
    removeClass(element, className);
  } else {
    addClass(element, className);
  }
};

export const replaceClass = (element, pattern, replacement) => {
  let classes = (element.className || '');

  if (pattern.test(classes)) {
    classes = classes.replace(pattern, replacement);

    setClassName(element, classes);
  } else if (replacement) {
    addClass(element, replacement);
  }
};
