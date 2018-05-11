export function compareMessages(a, b) {
    const aTime = a && a.lastMessage && a.lastMessage.created_at ? a.lastMessage.created_at : 0,
        bTime = b && b.lastMessage && b.lastMessage.created_at ? b.lastMessage.created_at : 0;
    if (aTime > bTime)
        return -1;
    else
        return 1;
}
