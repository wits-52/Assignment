const sessions = new Map();
const getUserSessions = (phone) => sessions.get(phone);
const insertUserSession = (phone, session) => {
    const userSessionDetails = getUserSessions(phone);
    if (!userSessionDetails) {
        sessions.set(phone,{
            phone,
            sessions: [{
                session,
                createdAt: new Date()
            }]
        });
    } else {
        if(userSessionDetails.sessions.length >= 3) {
            userSessionDetails.sessions = userSessionDetails.sessions.sort((a, b) => a.createdAt - b.createdAt);
            userSessionDetails.sessions[0].session.destroy();
            userSessionDetails.sessions[0] = {
                session,
                createdAt: new Date()
            };
        } else {
            userSessionDetails.sessions.push({
                session,
                createdAt: new Date()
            });
        }
        sessions.set(phone, userSessionDetails);
    }
};
const userHasSession = (phone, sessionId) => {
    const userSessionDetails = getUserSessions(phone);
    if (userSessionDetails) {
        return userSessionDetails.sessions.find(session => session.session.id === sessionId);
    }
    return undefined;
};
const updateSessionStage = (phone, session) => {
    const userSessionDetails = getUserSessions(phone);
    for (const userSession of userSessionDetails.sessions) {
        if (session.id === userSession.id) {
            userSession.stage = session.stage;
        }
    }
};
module.exports = {
    sessions,
    getUserSessions,
    insertUserSession,
    userHasSession,
    updateSessionStage
};