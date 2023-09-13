# backend

### How supabase subtree was setup
> Subtree changes are part of the main repo history
```sh
# add as subtree at services/backend/supabase and contain it all in one commit
git subtree add --prefix services/backend/supabase https://github.com/supabase/supabase.git master --squash
```

> See `package.json` scripts for how to update subtree

To make each subfolder a seperate repo that others can work on (incase of employees) while keeping it a subtree, use [git subtree split](https://lostechies.com/johnteague/2014/04/04/using-git-subtrees-to-split-a-repository/)