import { useState, useEffect, useMemo } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'as', name: 'Assamese' },
  { code: 'ast', name: 'Asturian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'my', name: 'Burmese' },
  { code: 'yue', name: 'Cantonese' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'ny', name: 'Chichewa' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'et', name: 'Estonian' },
  { code: 'fil', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'ff', name: 'Fulah' },
  { code: 'gl', name: 'Galician' },
  { code: 'lg', name: 'Ganda' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kea', name: 'Kabuverdianu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'lv', name: 'Latvian' },
  { code: 'ln', name: 'Lingala' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'luo', name: 'Luo' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'zh', name: 'Mandarin Chinese' },
  { code: 'mi', name: 'Māori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'ne', name: 'Nepali' },
  { code: 'nso', name: 'Northern Sotho' },
  { code: 'no', name: 'Norwegian' },
  { code: 'oc', name: 'Occitan' },
  { code: 'or', name: 'Odia' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tg', name: 'Tajik' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'umb', name: 'Umbundu' },
  { code: 'ur', name: 'Urdu' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'wo', name: 'Wolof' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'zu', name: 'Zulu' },
];

interface MicSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMicSelect: (deviceId: string) => void;
  onLanguageSelect: (languageCode: string) => void;
  microphones: MediaDeviceInfo[];
}

export const MicAndLanguageSelectDialog: React.FC<MicSelectDialogProps> = ({
  isOpen,
  onClose,
  onMicSelect,
  onLanguageSelect,
  microphones,
}) => {
  const [selectedMicId, setSelectedMicId] = useState(
    microphones[0].deviceId || '',
  );
  const [selectedLangCode, setSelectedLangCode] = useState('en');
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 500); // 500ms debounce for better UX

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Filter languages based on debounced input
  const filteredLanguages = useMemo(() => {
    return supportedLanguages.filter((lang) =>
      lang.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery]);
  const handleConfirm = () => {
    if (selectedMicId && selectedLangCode) {
      onMicSelect(selectedMicId);
      onLanguageSelect(selectedLangCode);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Microphone & Language</DialogTitle>
          <DialogDescription>
            Choose your input device and preferred language.
          </DialogDescription>
        </DialogHeader>

        {/* Microphone Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Microphone</label>
          <Select value={selectedMicId} onValueChange={setSelectedMicId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a microphone" />
            </SelectTrigger>
            <SelectContent>
              {microphones.map((mic) => (
                <SelectItem key={mic.deviceId} value={mic.deviceId}>
                  {mic.label || 'Unnamed microphone'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Select with Search */}
        <div className="mt-4 space-y-1">
          <label className="text-sm font-medium">Language</label>
          <Select value={selectedLangCode} onValueChange={setSelectedLangCode}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {supportedLanguages.find(
                  (lang) => lang.code === selectedLangCode,
                )?.name || 'Select a language'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              className="max-h-60 overflow-y-auto"
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1 mb-2">
                <Input
                  type="text"
                  placeholder="Search language..."
                  className="w-full border rounded h-8"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <div className="overflow-y-auto max-h-40">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {lang.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 mb-2">
                    No languages found.
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={!selectedMicId || !selectedLangCode}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
