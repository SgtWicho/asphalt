import { useState } from 'react';
import { draftRoute } from '../data/mock';

export function usePublish() {
  const [title, setTitle] = useState(draftRoute.title);
  const [tags, setTags] = useState<string[]>(draftRoute.defaultTags);
  const [published, setPublished] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const publish = () => {
    setPublished(true);
    return true;
  };

  return { draft: draftRoute, title, setTitle, tags, toggleTag, published, publish };
}
