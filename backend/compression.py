class VBEPostings:

    @staticmethod
    def vb_decode(encoded_bytestream):
        
        numbers = []
        n = 0

        for i in range(len(encoded_bytestream)):
            if encoded_bytestream[i] < 128:
                n = 128 * n + encoded_bytestream[i]
            else:
                n = 128 * n + encoded_bytestream[i] - 128
                numbers.append(n)
                n = 0

        return numbers

    @staticmethod
    def decode(encoded_postings_list):
       
        gap_list = VBEPostings.vb_decode(encoded_postings_list)

        postings_list = [gap_list[0]]
        for i in range(1, len(gap_list)):
            postings_list.append(postings_list[i-1] + gap_list[i])

        return postings_list

    @staticmethod
    def decode_tf(encoded_tf_list):
        
        return VBEPostings.vb_decode(encoded_tf_list)
