import { useState } from 'react';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

import { EpicFeedbackType } from '@workspace/database';
import { Button } from '@workspace/ui/components/button';
import { toast } from '@workspace/ui/components/sonner';
import { Textarea } from '@workspace/ui/components/textarea';

import { addFeedback } from '~/actions/epics/add-feedback';

export type EpicFeedbackWidgetProps = {
  message?: string;
  epicId: string;
  feedbackType: EpicFeedbackType;
  advancedToolId?: string;
};

export function EpicFeedbackWidget(props: EpicFeedbackWidgetProps) {
  const {
    message = 'Are you satisfied with the output?',
    epicId,
    feedbackType,
    advancedToolId
  } = props;

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [hasRated, setHasRated] = useState(false);

  const handleThumbsUp = async () => {
    setHasRated(true);
    const result = await addFeedback({
      epicId,
      feedbackType,
      advancedToolId,
      satisfied: true
    });
    if (result?.validationErrors || result?.serverError)
      toast.error('Something went wrong while adding feedback');
    else toast.success(`Thank you! Your positive feedback has been recorded`);
  };

  const handleThumbsDown = async () => {
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async () => {
    setHasRated(true);
    setShowFeedbackForm(false);

    const result = await addFeedback({
      epicId,
      feedbackType,
      advancedToolId,
      satisfied: false,
      reason: feedbackText
    });
    if (result?.validationErrors || result?.serverError)
      toast.error('Something went wrong while adding feedback');
    else toast.success('Your feedback has been recorded. Thank you!');
  };

  if (hasRated) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-white/10">
      <p className="text-sm font-medium mb-3">{message}</p>

      {!showFeedbackForm ? (
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleThumbsUp}
            className="flex items-center gap-2"
          >
            <ThumbsUpIcon className="h-4 w-4" /> Yes, it's good
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleThumbsDown}
            className="flex items-center gap-2"
          >
            <ThumbsDownIcon className="h-4 w-4" /> No, needs improvement
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please tell us how we can improve..."
            className="w-full h-24"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitFeedback}
              disabled={!feedbackText.trim()}
            >
              Submit Feedback
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedbackForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
