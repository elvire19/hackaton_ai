const sendNotification = async (session, type) => {
    // Simulated notification service
    const notifications = {
      session_scheduled: {
        title: 'New Mentoring Session Scheduled',
        template: 'Your mentoring session has been scheduled for {startTime}'
      },
      session_reminder: {
        title: 'Upcoming Mentoring Session',
        template: 'Reminder: You have a mentoring session in 1 hour'
      },
      session_completed: {
        title: 'Mentoring Session Completed',
        template: 'Your mentoring session has been marked as completed'
      },
      session_cancelled: {
        title: 'Mentoring Session Cancelled',
        template: 'Your mentoring session has been cancelled'
      }
    };
  
    const notification = notifications[type];
    if (!notification) return;
  
    // Simulate sending notification
    console.log(`[NOTIFICATION] ${notification.title}`);
    console.log(`[NOTIFICATION] ${notification.template.replace('{startTime}', session.startTime)}`);
  
    // Update notification status in session
    if (type === 'session_reminder') {
      await session.update({
        notificationsSent: { ...session.notificationsSent, reminder: true }
      });
    }
  };
  
  module.exports = {
    sendNotification
  };