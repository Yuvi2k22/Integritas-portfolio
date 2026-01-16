import React, { useState } from 'react';
import { Edit3, Save, X, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';

interface TranscriptionResultProps {
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  stepsCompleted?: number;
}

export function TranscriptionResult({
  transcription,
  onTranscriptionChange,
  stepsCompleted = 0,
}: TranscriptionResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcription);
  const handleSave = () => {
    onTranscriptionChange(editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(transcription);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Main Transcription Card */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Transcription
                </h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    disabled={stepsCompleted > 2.1}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="min-h-[300px] resize-none bg-white border border-slate-200 rounded-lg p-6 max-h-[400px] overflow-y-auto"
                placeholder="Edit your transcription..."
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                {transcription ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap m-0">
                      {transcription}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      No transcription available
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Start recording to generate transcription
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
