/**
 * Leave-type helpers 
 */

/**
 * Find a leave type in a list by its id.
 *
 * @param {Array|null|undefined} leaveTypes - e.g. store.getters.leave_types
 * @param {number|string|null|undefined} id - selected leave type id
 * @returns {Object|null} the matching leave type, or null
 */
export function getLeaveTypeById(leaveTypes, id) {
  if (!leaveTypes || id === null || id === undefined) return null;
  return leaveTypes.find((type) => type.id === id) || null;
}

/**
 * Return the trimmed, non-empty `message` of a leave type, or null.
 *
 * @param {Object|null|undefined} leaveType
 * @returns {string|null} the message to display, or null when there is none
 */
export function leaveTypeMessage(leaveType) {
  const message = leaveType && leaveType.message;
  return message && message.trim() ? message : null;
}
