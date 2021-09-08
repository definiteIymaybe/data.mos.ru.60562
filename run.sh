saved_items=0
description_file="structure-20191224(vs3).json"
description_url="https://data.mos.ru/apiproxy/opendata/7705031674-adresniy-reestr-zdaniy-i-soorujeniy-v-gorode-moskve/$description_file"

curl $description_url > "./data/$description_file"
row_count="$(cat ./data/$description_file | jq '.ItemsCount')"

for filename in ./data/parts/*.csv; do
    [ -e "$filename" ] || continue
    non_empty_lines_excl_header="$(cat $filename | sed '/^\s*$/d' | wc -l)"
    saved_items=$((saved_items + non_empty_lines_excl_header))
    echo "$filename: $non_empty_lines total: $saved_items rowcount: $row_count"
    # ... rest of the loop body
done

npm run 60562 $saved_items $row_count
