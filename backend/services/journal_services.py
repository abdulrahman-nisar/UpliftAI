from data.entries import entries
from model.JournalEntry import JournalEntry
from typing import Optional

def get_all_journal_entires(userId: int) -> list[JournalEntry]:
    """
    Retrieve all journal entries for a specific user.

    Args:
        userId (int): The ID of the user whose entries are requested.

    Returns:
        list[JournalEntry]: A list of journal entries belonging to the user.
    """
    return entries


def get_journal_entry(entryId: int) -> Optional[JournalEntry]:
    """
    Retrieve a single journal entry by its ID.

    Args:
        entryId (int): The ID of the entry to retrieve.

    Returns:
        dict | None: The journal entry if found, otherwise None.
    """
    for entry in entries:
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
    for i, entry in enumerate(entries):
        if entry['entryId'] == entryId:
            del entries[i]
            return True
    return False


def update_journal_entry(updated_entry: dict) -> bool:
    """
    Update an existing journal entry with new data.

    Args:
        updated_entry (dict): The updated entry dictionary.
                              Must contain a valid 'entryId'.

    Returns:
        bool: True if the entry was found and updated, False if not found.
    """
    for i, entry in enumerate(entries):
        if entry['entryId'] == updated_entry['entryId']:
            entries[i] = updated_entry
            return True
    return False