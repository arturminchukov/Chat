export function compareMessages(a, b) {
    a = a && a.lastMessage && a.lastMessage.created_at ? a.lastMessage.created_at : 0;
    b = b && b.lastMessage && b.lastMessage.created_at ? b.lastMessage.created_at : 0;
    if (a > b)
        return -1;
    else
        return 1;
}
