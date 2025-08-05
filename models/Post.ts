import { model, Schema } from 'mongoose';

const postSchema = new Schema({
  title: String,
  content: String,
  tags: [String],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      body: String,
      commentor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      replies: [
        {
          body: String,
          replier: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          },
          likes: [
            {
              liker: {
                type: Schema.Types.ObjectId,
                ref: 'User'
              },
              createdAt: String
            }
          ],

          isEdited: Boolean,
          createdAt: String
        }
      ],
      likes: [
        {
          liker: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          },
          createdAt: String
        }
      ],
      isEdited: Boolean,
      createdAt: String
    }
  ],
  likes: [
    {
      liker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: String
    }
  ],
  saves: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: String
    }
  ],
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
});

export default model('Post', postSchema);
