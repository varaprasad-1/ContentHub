const cron = require('node-cron');
const Schedule = require('../models/Schedule');
const Post = require('../models/Post');

function startScheduler() {
  // Check pending schedules every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      const schedules = await Schedule.find({
        status: 'pending',
        scheduledTime: { $lte: now }
      });

      for (const schedule of schedules) {
        try {
          // Mark schedule as being processed
          schedule.status = 'published';
          await schedule.save();

          // Update the associated post
          const post = await Post.findById(schedule.postId);

          if (post) {
            post.status = 'published';
            post.scheduledTime = schedule.scheduledTime;
            await post.save();
          }

          console.log(
            `Schedule ${schedule._id} processed successfully`
          );
        } catch (error) {
          console.error(
            `Failed to process schedule ${schedule._id}:`,
            error.message
          );

          await Schedule.findByIdAndUpdate(
            schedule._id,
            { status: 'failed' }
          );
        }
      }
    } catch (error) {
      console.error('Scheduler error:', error.message);
    }
  });

  console.log('ContentHub scheduler started');
}

module.exports = startScheduler;