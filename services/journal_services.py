from temporarydatastore.entries import journal_entries
from models.JournalEntryModel import JournalEntryModel
from typing import Optional

def get_all_journal_entires(userId: int) -> list[JournalEntryModel]:
    """
    Retrieve all journal entries for a specific user.

    Args:
        userId (int): The ID of the user whose entries are requested.

    Returns:
        list[JournalEntry]: A list of journal entries belonging to the user.
    """
    return journal_entries




def get_journal_entry(entryId: int) -> Optional[JournalEntryModel]:
    """
    Retrieve a single journal entry by its ID.

    Args:
        entryId (int): The ID of the entry to retrieve.

    Returns:
        dict | None: The journal entry if found, otherwise None.
    """
    for entry in journal_entries:
        if entry['entryId'] == entryId:
            return entry
    return None


def delete_journal_entry(entryId: int) -> bool:
    """
    Delete a journal entry by its ID.

    Args:
        entryId (int): The ID of the entry to delete.

    Returns:
        bool: True if the entry was found and deleted, False if not found.
    """
    for i, entry in enumerate(journal_entries):
        if entry['entryId'] == entryId:
            del journal_entries[i]
            return True
    return False


def create_journal_entry(new_entry: JournalEntryModel) -> bool:
    """
    Create a new journal entry and add it to the entries list.

    Args:
        new_entry (JournalEntry): The new entry object to be added.

    Returns:
        bool: True if the entry was successfully added, 
              False if an entry with the same 'entryId' already exists.
    """
    
    for entry in journal_entries:
        if entry.entry_id == new_entry.entry_id:
            return False

    journal_entries.append(new_entry)
    return True



def update_journal_entry(updated_entry: JournalEntryModel) -> bool:
    """
    Update an existing journal entry with new data.

    Args:
        updated_entry (dict): The updated entry dictionary.
                              Must contain a valid 'entryId'.

    Returns:
        bool: True if the entry was found and updated, False if not found.
    """
    for i, entry in enumerate(journal_entries):
        if entry['entryId'] == updated_entry['entryId']:
            journal_entries[i] = updated_entry
            return True
    return False