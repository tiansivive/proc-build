

export const colors = ['red', 'blue', 'green', 'yellow', 'black', 'cyan', 'orange', 'pink', 'magenta', 'purple', 'grey'] as const


export const next = (i: number): typeof colors[number] => colors[i % colors.length]