### fuzzy finder 

fzf 是一个模糊文件搜索工具,用以快速查找文件,也可以结合其他工具是用来达成命令补全等功能

### 安装

```sh
sudo apt install fzf
```


### 搜索文件

```sh
fzf 
```

### 结合其他工具使用


#### vim 

```sh
vim $(fzf)
```

在vim中使用fzf，需要安装[vim的插件](https://github.com/junegunn/fzf/blob/master/README-VIM.md)

这里使用 vim-plug 安装, fzf 件会在 `$PATH` 当中搜索fzf的可执行文件，如果没有则需要提前安装

```vim
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
```

```vim
" 当前目录下的所有文件
:FZF

" 主目录下的所有文件
:FZF ~

" With fzf command-line options
:FZF --reverse --info=inline /tmp

" 以全屏方式使用 `fzf`
:FZF!
```


这是官网提供的配置参考

`g:fzf_action`

自定义快捷键用不同的方式打开选择的文件

`g:fzf_layout`

决定fzf窗口的大小和位置

`g:fzf_colors`

自定义fzf的颜色以符合现有的配色方案

`g:fzf_history_dir`

激活`history`功能

```vim
" This is the default extra key bindings
let g:fzf_action = {
  \ 'ctrl-t': 'tab split',
  \ 'ctrl-x': 'split',
  \ 'ctrl-v': 'vsplit' }

" An action can be a reference to a function that processes selected lines
function! s:build_quickfix_list(lines)
  call setqflist(map(copy(a:lines), '{ "filename": v:val }'))
  copen
  cc
endfunction

let g:fzf_action = {
  \ 'ctrl-q': function('s:build_quickfix_list'),
  \ 'ctrl-t': 'tab split',
  \ 'ctrl-x': 'split',
  \ 'ctrl-v': 'vsplit' }

" Default fzf layout
" - Popup window (center of the screen)
let g:fzf_layout = { 'window': { 'width': 0.9, 'height': 0.6 } }

" - Popup window (center of the current window)
let g:fzf_layout = { 'window': { 'width': 0.9, 'height': 0.6, 'relative': v:true } }

" - Popup window (anchored to the bottom of the current window)
let g:fzf_layout = { 'window': { 'width': 0.9, 'height': 0.6, 'relative': v:true, 'yoffset': 1.0 } }

" - down / up / left / right
let g:fzf_layout = { 'down': '40%' }

" - Window using a Vim command
let g:fzf_layout = { 'window': 'enew' }
let g:fzf_layout = { 'window': '-tabnew' }
let g:fzf_layout = { 'window': '10new' }

" Customize fzf colors to match your color scheme
" - fzf#wrap translates this to a set of `--color` options
let g:fzf_colors =
\ { 'fg':      ['fg', 'Normal'],
  \ 'bg':      ['bg', 'Normal'],
  \ 'hl':      ['fg', 'Comment'],
  \ 'fg+':     ['fg', 'CursorLine', 'CursorColumn', 'Normal'],
  \ 'bg+':     ['bg', 'CursorLine', 'CursorColumn'],
  \ 'hl+':     ['fg', 'Statement'],
  \ 'info':    ['fg', 'PreProc'],
  \ 'border':  ['fg', 'Ignore'],
  \ 'prompt':  ['fg', 'Conditional'],
  \ 'pointer': ['fg', 'Exception'],
  \ 'marker':  ['fg', 'Keyword'],
  \ 'spinner': ['fg', 'Label'],
  \ 'header':  ['fg', 'Comment'] }

" Enable per-command history
" - History files will be stored in the specified directory
" - When set, CTRL-N and CTRL-P will be bound to 'next-history' and
"   'previous-history' instead of 'down' and 'up'.
let g:fzf_history_dir = '~/.local/share/fzf-history'
``` 


### 预览文件

fzf 不仅可以动态的搜索文件，还可以在搜索的同时预览文件

```sh
fzf --preview --height=40%
```

也可以设置 fzf 的预览窗口样式

