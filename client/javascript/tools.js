/**
 * Creates a DOM element with specified tag, attributes and children
 * @param {string} tag - HTML element tag name
 * @param {object} attributes - Object containing element attributes
 * @param {array|string|Node} children - Element content or child elements
 * @returns {HTMLElement} - The created DOM element
 */
export const buildElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      // Event listeners (onClick, onInput, etc.)
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === "className") {
      // Handle className specially
      element.className = value;
    } else if (key === "style" && typeof value === "object") {
      // Handle style objects
      Object.assign(element.style, value);
    } else {
      // Regular attributes
      element.setAttribute(key, value);
    }
  });

  // Add children
  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else {
        element.appendChild(document.createTextNode(String(child)));
      }
    });
  } else if (children instanceof Node) {
    element.appendChild(children);
  } else if (children !== null && children !== undefined) {
    element.appendChild(document.createTextNode(String(children)));
  }

  return element;
};

/**
 * Displays a message to the user
 * @param {string} message - Message content
 * @param {string} type - Message type (success, error, info)
 */
export const displayMessage = (message, type = "info") => {
  const messageDiv = buildElement(
    "div",
    {
      className: `message ${type}`,
      style: {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: type === "error" ? "#ff4444" : "#44bb44",
        color: "white",
        borderRadius: "4px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: 1000,
      },
    },
    message
  );

  document.body.appendChild(messageDiv);

  // Remove after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      document.body.removeChild(messageDiv);
    }
  }, 3000);
};
