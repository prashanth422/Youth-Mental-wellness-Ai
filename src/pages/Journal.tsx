import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Plus, 
  Save, 
  Calendar,
  Tag,
  Trash2
} from 'lucide-react';

const moodOptions = [
  { key: 'great', icon: '😄', color: 'bg-green-100 text-green-800' },
  { key: 'good', icon: '😊', color: 'bg-blue-100 text-blue-800' },
  { key: 'okay', icon: '😐', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'low', icon: '😔', color: 'bg-orange-100 text-orange-800' },
  { key: 'difficult', icon: '😟', color: 'bg-red-100 text-red-800' },
];

export default function Journal() {
  const { t } = useTranslation();
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [entries, setEntries] = useState<any[]>([]);

  // Load initial motivational entries 🧠
  useEffect(() => {
    const initialMotivations = [
      {
        id: 1,
        title: "Keep Going 💪",
        content: "Even the darkest night will end, and the sun will rise.",
        mood: "great",
        tags: ["motivation", "hope"],
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Stay Positive ✨",
        content: "Believe you can and you’re halfway there.",
        mood: "good",
        tags: ["confidence", "success"],
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "New Day 🌅",
        content: "Every morning brings a new chance to rewrite your story.",
        mood: "okay",
        tags: ["freshstart", "growth"],
        createdAt: new Date(),
      },
    ];
    setEntries(initialMotivations);
  }, []);

  // Save entry handler
  const handleSaveEntry = () => {
    if (!content.trim() || !selectedMood) return;

    const newEntry = {
      id: Date.now(),
      title: title || "Untitled Entry",
      content,
      mood: selectedMood,
      tags,
      createdAt: new Date(),
    };

    setEntries([newEntry, ...entries]);
    setIsWriting(false);
    setTitle('');
    setContent('');
    setSelectedMood('');
    setTags([]);
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 🗑 Delete entry
  const deleteEntry = (id: number) => {
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-energy rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('journal.title')}</h1>
            <p className="text-muted-foreground">Express your thoughts and track your journey</p>
          </div>
        </div>
        
        {!isWriting && (
          <Button
            onClick={() => setIsWriting(true)}
            className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('journal.writeEntry')}
          </Button>
        )}
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Write Entry Form */}
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <Card className="glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>New Journal Entry</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entry Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="focus-ring"
                  />
                </div>

                {/* Mood Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('journal.moodTracker')}</label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((mood) => (
                      <Button
                        key={mood.key}
                        variant={selectedMood === mood.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood(mood.key)}
                        className={`${selectedMood === mood.key ? 'bg-primary text-white' : ''}`}
                      >
                        <span className="mr-2">{mood.icon}</span>
                        {t(`moods.${mood.key}`)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Thoughts</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write about your day, your feelings, or anything on your mind..."
                    className="min-h-[200px] resize-none focus-ring"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSaveEntry}
                    className="bg-gradient-primary hover:opacity-90 text-white"
                    disabled={!content.trim()}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t('journal.saveEntry')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsWriting(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Entries List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={isWriting ? 'lg:col-span-1' : 'lg:col-span-3'}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{t('journal.entries')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-4">
                  {entries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-20">
                      No entries yet. Start writing your first one!
                    </p>
                  ) : (
                    entries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border border-border/20 rounded-lg p-4 hover:shadow-medium transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{entry.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {moodOptions.find(m => m.key === entry.mood)?.icon} {t(`moods.${entry.mood}`)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {entry.content.slice(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1">
                            {entry.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {entry.createdAt.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
