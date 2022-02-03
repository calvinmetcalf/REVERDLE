REVERDLE
===

command line tool to find possible guesses based on a wordle pattern.

Usage is `reverdle word pattern` with pattern being the emojis you get.

Words that are possible answers are printed in yellow.

so if somebody posted the following pattern for the word "those":

```
🟩⬛⬛⬛🟩
🟩🟩⬛⬛🟩
🟩🟩⬛⬛🟩
🟩🟩⬛🟩🟩
🟩🟩🟩🟩🟩
```

and you wanted to know the second to last guess you could run

`reverdle those 🟩🟩⬛🟩🟩`

and it would print out `these`

Note you can also use letters instead of the emojis, you can use b or k (or w or even x) for the black (or white, i.e. not-in-the-word) squares then y for yellow and g for green.

So if the word was "deton" and this was the pattern

```
⬛⬛⬛⬛⬛
⬛⬛⬛⬛⬛
⬛⬛🟨🟨🟨
⬛🟩🟨🟩⬛
⬛🟩⬛🟩🟩
🟩🟩🟩🟩🟩
```

running `reverdle deton bgygb` would show you the possible 4th guesses and running `reverdle deton bgbgg` would show you the possible 5th ones.

The word list is from qntm's fantastic [absurdle](https://qntm.org/files/absurdle/absurdle.html) who presumably got it from the [real wordle page](https://www.powerlanguage.co.uk/wordle/).
