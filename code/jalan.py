def Solusi(angka, bulatan, list_bulatan):        
    hasil = [0]*bulatan
    for i,v in enumerate(list_bulatan): 
        total = 0
        t = False
        listc = [] 
        for j in angka:
            if((v / j).is_integer()):
                total = v//j
                t = True
                listc.append(total)

        if t: 
            hasil[i] = min(listc)
            continue

        while v >= hasil[i]:
            if(hasil[i] + max(angka) > v):
                c = (hasil[i]+max(angka)) - v
                if c in angka:
                    total += 1
                    hasil[i] = total
                else: 
                    hasil[i] = 0

                break      
            hasil[i] += max(angka)
            total += 1
        hasil[i] = total
        
    return hasil

def ApakahSama(fungsi, parameter, jawaban):
    try:
        hasil = fungsi(*parameter)
        return {"hasil": str(hasil) if hasil == None else hasil, "jawaban": jawaban, "status": "Sukses"}
    except Exception as e:
        import base64
        return {"hasil": base64.b64encode(str(e).encode('utf-8')).decode('utf-8'), "jawaban": jawaban, "status": "Error"}
        
