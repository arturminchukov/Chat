export default function formatMessage(text, rules){
        const buf = text.split(/[\s\n]/g);
    return buf.map((el)=>{
        for (let i = 0; i < rules.length; i++){
            let result = rules[i](el);
            if (result){
                if(result.type === ""){

                }
                return result;
            }
        }
        return {
            type: 'text',
            text: el,
        }
    })
}