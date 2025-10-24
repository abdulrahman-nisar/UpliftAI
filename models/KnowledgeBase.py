class KnowledgeBase:
    def __init__(self, kb_id, category, text):
        self.kb_id = kb_id
        self.category = category  # e.g., "stress", "motivation"
        self.text = text  # actual content for retrieval