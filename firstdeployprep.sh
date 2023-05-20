# to be called on first deploy
for arg; do
    echo "disabling $arg"
    npm run disable $arg
done